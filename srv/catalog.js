const cds = require("@sap/cds");
const QtAnswerSet = require("./entity_ZCUX_QT_ANSSet");
const PossAnswerSet = require("./entity_ZCUX_POSS_ANSWERSet");
const QuestionnaireSet = require("./entity_ZCUX_QUESTIONNAIRESet");

module.exports = async function (srv) {

    const db = await cds.connect.to("db");

    srv.on("READ", "ZCUX_POSS_ANSWERSet", async (req,next) => {
        return PossAnswerSet.read(db,req,next);
    });

    // EntitySet ZCUX_POSS_ANSWERSet
    srv.on("READ", "ZCUX_POSS_ANSWERSet", async (req,next) => {
        return PossAnswerSet.expandedFromQuestionarie(db,req,next);
    });

    srv.on("CREATE", "ZCUX_POSS_ANSWERSet", async (req) => {
        return PossAnswerSet.create(db,req);
    });

    srv.on("DELETE", "ZCUX_POSS_ANSWERSet", async (req) => {
        return PossAnswerSet.delete(db,req);

    });

    srv.on("UPDATE", "ZCUX_POSS_ANSWERSet", async (req) => {
        return PossAnswerSet.update(db,req);
    });


    // EntitySet ZCUX_QT_ANSSet
    srv.on("READ", "ZCUX_QT_ANSSet", async (req) => {
        return QtAnswerSet.read(db, req);
    });

    srv.on("CREATE", "ZCUX_QT_ANSSet", async (req) => {
        return QtAnswerSet.create(db, req);
    });

    srv.on("DELETE", "ZCUX_QT_ANSSet", async (req) => {
        return QtAnswerSet.delete(db, req);
    });

    srv.on("UPDATE", "ZCUX_QT_ANSSet", async (req) => {
        return QtAnswerSet.update(db, req);
    });


    // EntitySet ZCUX_QUESTIONNAIRESet


    //ZCUX_QUESTIONNAIRESet?$expand=Answers
    srv.on("READ", "ZCUX_QUESTIONNAIRESet", async (req, next) => {
        return QuestionnaireSet.read_association(db, req, next);
    });

    srv.on("READ", "ZCUX_QUESTIONNAIRESet", async (req, next) => {
        return QuestionnaireSet.read(db, req);
    });

    srv.before("CREATE", "ZCUX_QUESTIONNAIRESet", async (req) => {
        return QuestionnaireSet.beforeCreate(db, req);
    });

    srv.on("CREATE", "ZCUX_QUESTIONNAIRESet", async (req) => {
        return QuestionnaireSet.create(db, req);
    });

    srv.on("DELETE", "ZCUX_QUESTIONNAIRESet", async (req) => {
        return QuestionnaireSet.delete(db, req);
    });

    srv.on("UPDATE", "ZCUX_QUESTIONNAIRESet", async (req) => {
        return QuestionnaireSet.update(db, req);
    });

}