import winston from 'winston'

export default class LoggerService {
    constructor(env) {
        this.options = {
            levels: {
                debug: 0,
                http: 1,
                info: 2,
                warning: 3,
                error: 4,
                fatal: 5,
            }
        }
        this.logger = this.createLogger(env)
    }

    createLogger = env => {
        switch (env) {
            case 'development':
                return winston.createLogger({
                    levels: this.options.levels,
                    transports: [
                        new winston.transports.Console({
                            level: 'info'
                        }),
                    ]
                })
            case 'qa':
                break
            case "production":
                return winston.createLogger({
                    levels: this.options.levels,
                    transports: [
                        new winston.transports.Console({
                            level: 'info'
                        }),
                        new winston.transports.File({
                            level: "info",
                            filename: './activity.log'
                        })
                    ]
                })
        }
    }
}