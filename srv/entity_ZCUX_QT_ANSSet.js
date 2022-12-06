module.exports = {

    read: async (db, req) => {

        const aFilter = mapSrv2Db(req.data);
        const oLimit = req.query.SELECT.limit;

        let query;

        if ((typeof aFilter !== "undefined")) {
            query = SELECT.from('ZCUX_QT_ANSWER').alias('').limit(oLimit).where(aFilter);
        } else {
            query = SELECT.from('ZCUX_QT_ANSWER').alias('').limit(oLimit);
        }

        let aData = await db.run(query);

        return aData.map(oObj => {
            return mapDb2Srv(oObj);
        });

    },

    create: async (db, req) => {

        let oObj = {
            IdQuestion: req.data.IdQuestion.toString().padStart(10, "0"),
            IdAnswer: req.data.IdAnswer.toString().padStart(10, "0"),
            TextAnswer: req.data.TextAnswer,
            Username: req.user.id
        };

        let query = INSERT.into('ZCUX_QT_ANSWER').entries(mapSrv2Db(oObj));

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
            const query = DELETE.from("ZCUX_QT_ANSWER").where(aFilter);
            await db.run(query);
        } else {

        }

    },

    update: async (db, req) => {

        let aKeys = ["IdQuestion", "Username"];

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


        const query = UPDATE("ZCUX_QT_ANSWER").where(mapSrv2Db(oFilter)).with(mapSrv2Db(oData));
   
        await db.run(query);

    }

};

let mapSrv2Db = (oObj) => {
    const oDbFields = {
        IdQuestion: "ID_QUESTION",
        Username: "USERNAME",
        TextAnswer: "TEXT_ANSWER",
        IdAnswer: "ID_ANSWER",
        Change: "CHANGE"
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
        USERNAME: "Username",
        TEXT_ANSWER: "TextAnswer",
        ID_ANSWER: "IdAnswer",
        CHANGE: "Change"
    };

    let aProperties = Object.getOwnPropertyNames(oObj),
        oReturn = {};
    aProperties.forEach(sName => {
        oReturn[oDbFields[sName]] = oObj[sName];
    });

    return oReturn;
};