module.exports.PORT = process.env.PORT;

const argEnv = process.argv.find((value) => {return value.startsWith('-env=')})
let env = "development"
if (argEnv != undefined) {
    env = argEnv.replace('-env=', '')
};
module.exports.ENV = env;