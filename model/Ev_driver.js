const postgre =  require('pg');

const driverSchema = new postgre.schema({
    email: {
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        minLength:6
    },
    phone:{
        type:Int,
        required: true,
        minLength:10,
        maxLength:11
    },
});

const Ev_driver = postgre.model('')