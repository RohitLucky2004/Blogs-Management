import {env} from "process"

export default ()=>({
    PORT:parseInt(env.PORT,10) ||4200,
    MONGODB_CONFIG:{
        uri:env.MONGODB_URI,
        dbName:env.MONGODB_NAME
    }
});