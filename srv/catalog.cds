service Catalog @(impl : './catalog.js', requires: 'authenticated-user')

{

    entity ZCUX_POSS_ANSWERSet {
        key IdQuestion : String(10) not null;
        key IdAnswer   : String(10) not null;
            TextAnswer : String(255);
    }

    entity ZCUX_QT_ANSSet {
        key IdQuestion : String(10) not null;
        key Username    : String(50) not null @cds.on.insert : $user;
            TextAnswer  : String(255);
            IdAnswer    : String(10);
            Change      : Timestamp @cds.on.insert : $now;
    }

    entity ZCUX_QUESTIONNAIRESet {
        key IdQuestion   : String(10) not null;
            TextQuestion : String(255) not null;
            TypeAnswer   : String(2);
            ExtraTooltip : String(10);
            Answers : Association to many ZCUX_POSS_ANSWERSet on Answers.IdQuestion = IdQuestion;
    }

};

