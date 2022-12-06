module.exports = {

    expandedFromQuestionarie: async (db, req, next) => {
        console.log("-----------------------------> novo");

        const select = req.query.SELECT;

        if (!(select.from.ref.length == 2 && select.from.ref[0].id == 'Catalog.ZCUX_QUESTIONNAIRESet')){
            return next();
        }

        const iIndex = select.from.ref[0].where.findIndex((ref) => ref.ref[0] == "IdQuestion")
        select.from.ref[0].where[iIndex].ref[0] = "ID_QUESTION";

        const query = SELECT.from('ZCUX_QT_CMB_SRV').alias('').where(select.from.ref[0].where);

        let aData = await db.run(query);

        return aData.map(oObj => {
            return mapDb2Srv(oObj);
        });

    },

    read: async (db, req, next) => {

        const select = req.query.SELECT;

        if (select.from.ref.length == 2 && select.from.ref[0].id == 'Catalog.ZCUX_QUESTIONNAIRESet'){
            return next();
        } 
       
        const aFilter = mapSrv2Db(req.data) || undefined;
        const oLimit = select.limit;

        let query;

        if ((typeof aFilter !== "undefined")) {
            query = SELECT.from('ZCUX_QT_CMB_SRV').alias('').limit(oLimit).where(aFilter);
        } else {
            query = SELECT.from('ZCUX_QT_CMB_SRV').alias('').limit(oLimit);
        }

        let aData = await db.run(query);

        return aData.map(oObj => {
            return mapDb2Srv(oObj);
        });

    },

    create: async (db, req) => {

        let oObj = {
            "IdQuestion": req.data.IdQuestion.toString().padStart(10, "0"),
            "IdAnswer": req.data.IdAnswer.toString().padStart(10, "0"),
            "TextAnswer": req.data.TextAnswer
        };

        let query = INSERT.into('ZCUX_QT_CMB_SRV').entries(mapSrv2Db(oObj));

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

        //console.log("Before End", returnData);
        return returnData;

    },

    delete: async (db, req) => {

        const aFilter = mapSrv2Db(req.data) || undefined;

        if (typeof aFilter !== "undefined") {
            const query = DELETE.from("ZCUX_QT_CMB_SRV").where(aFilter);
            await db.run(query);
        } else {

        }

    },

    update: async (db, req) => {

        let aKeys = ["IdQuestion", "IdAnswer"];

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


        const query = UPDATE("ZCUX_QT_CMB_SRV").where(mapSrv2Db(oFilter)).with(mapSrv2Db(oData));
        await db.run(query);

    }

};

let mapSrv2Db = (oObj) => {
    const oDbFields = {
        IdQuestion: "ID_QUESTION",
        TextAnswer: "TEXT_ANSWER",
        IdAnswer: "ID_ANSWER"
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