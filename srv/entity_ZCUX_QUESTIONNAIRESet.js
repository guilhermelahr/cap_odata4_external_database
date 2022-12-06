const QtAnswerSet = require("./entity_ZCUX_QT_ANSSet");

module.exports = {

    read: async (db, req) => {
 
        const aFilter = mapSrv2Db(req.data);
        const oLimit = req.query.SELECT.limit;

        let query;

        if ((typeof aFilter !== "undefined")) {
            query = SELECT.from('ZCUX_QT_QUESTION').alias('').limit(oLimit).where(aFilter);
        } else {
            query = SELECT.from('ZCUX_QT_QUESTION').alias('').limit(oLimit);
        }

        let aData = await db.run(query);
     
        return aData.map(oObj => {
            return mapDb2Srv(oObj);
        });

    },

    read_association: async (db, req, next) => {
   
        if (!req.query.SELECT.columns) return next();
        const expandIndex = req.query.SELECT.columns.findIndex(
            ({ expand, ref }) => expand && ref[0] === "Answers"
        );
        
        if (expandIndex < 0) return next();

        const aFilter = mapSrv2Db(req.data);
        const oLimit = req.query.SELECT.limit;

        if ((typeof aFilter !== "undefined")) {
            SELECT.from('ZCUX_QT_QUESTION').alias('').limit(oLimit).where(aFilter);
        } else {
            SELECT.from('ZCUX_QT_QUESTION').alias('').limit(oLimit);
        }

        const Questionarie = await next();

        const asArray = x => Array.isArray(x) ? x : [ x ];
     
        const aIdQuestions = asArray(Questionarie).map(questionarie => questionarie.IdQuestion);
        const answers = await db.run(SELECT.from('ZCUX_QT_CMB_SRV').where({ "ID_QUESTION": aIdQuestions }));

        const answersConverted = answers.map(oObj => {
            return mapAnswerDb2Srv(oObj);
        });
        
         // Convert in a map for easier lookup
          const answerMap = {};
          for (const answer of answersConverted){
             answerMap[answer.IdQuestion] = answer;
          }

         //Add suppliers to result
          for (const note of asArray(Questionarie)) {
              note.Answers = answerMap[note.IdQuestion];
          }

         return Questionarie;
  
    },

    beforeCreate: async (db,req) => {
        const { newID } = await SELECT.one `max(ID_QUESTION) + 1 as newID` .from ("ZCUX_QT_QUESTION");
        req.data.IdQuestion = newID;
    },

    create: async (db, req) => {

        let oObj = {
            IdQuestion: req.data.IdQuestion.toString().padStart(10, "0"),
            TextQuestion: req.data.TextQuestion,
            TypeAnswer: req.data.TypeAnswer,
            ExtraTooltip: req.data.ExtraTooltip
        };

        let query = INSERT.into('ZCUX_QT_QUESTION').entries(mapSrv2Db(oObj));

        let returnData = await db
            .run(query)
            .then((resolve, reject) => {
                if (typeof resolve !== "undefined") {
                    return oObj;
                } else {
                    req.error(409, "Record Not Found");
                }
            })
            .catch(err => {
                console.log(err);
                req.error(500, "Error in Updating Record");
            });

        return returnData;
    },

    delete: async (db,req) => {

        const aFilter = mapSrv2Db(req.data) || undefined;

        if (typeof aFilter !== "undefined") {
            const query = DELETE.from("ZCUX_QT_QUESTION").where(aFilter);
            await db.run(query);
        } else {

        }

    },

    update: async (db, req) => {

        let aKeys = ["IdQuestion"];

        const oFilter = Object.keys(req.data).reduce((oObject, newValue) => {
            if (aKeys.includes(newValue)) {
                oObject[newValue] = req.data[newValue];
            }
            return oObject;
        }, {});

        const oData = Object.keys(req.data).reduce((oObject, newValue) => {
            if (!aKeys.includes(newValue)) {
                oObject[newValue] = req.data[newValue];
            }
            return oObject;
        }, {});


        const query = UPDATE("ZCUX_QT_QUESTION").where(mapSrv2Db(oFilter)).with(mapSrv2Db(oData));
   
        await db.run(query);

    }

};

let mapSrv2Db = (oObj) => {
    const oDbFields = {
        IdQuestion: "ID_QUESTION",
        TextQuestion: "TEXT_QUESTION",
        TypeAnswer: "TYPE_ANSWER",
        ExtraTooltip: "EXTRA_TOOLTIP"
    };

    let aProperties = Object.getOwnPropertyNames(oObj),
        oReturn = {};
    aProperties.forEach(sName => {
        oReturn[oDbFields[sName]] = oObj[sName];
    });

    return oReturn;
};

let mapDb2Srv = (oObj) => {
    const oDbFields = {
        ID_QUESTION: "IdQuestion",
        TEXT_QUESTION: "TextQuestion",
        TYPE_ANSWER: "TypeAnswer",
        EXTRA_TOOLTIP: "ExtraTooltip"
    };

    let aProperties = Object.getOwnPropertyNames(oObj),
        oReturn = {};
    aProperties.forEach(sName => {
        oReturn[oDbFields[sName]] = oObj[sName];
    });

    return oReturn;
};

let mapAnswerDb2Srv = (oObj) => {
    const oDbFields = {
        ID_QUESTION: "IdQuestion",
        ID_ANSWER: "IdAnswer",
        TEXT_ANSWER: "TextAnswer"
    };

    let aProperties = Object.getOwnPropertyNames(oObj),
        oReturn = {};
    aProperties.forEach(sName => {
        oReturn[oDbFields[sName]] = oObj[sName];
    });

    return oReturn;
};