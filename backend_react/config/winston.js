const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const logFormat = format.printf(({ timestamp, level, message, userInfos, routeType }) => {
    return `[${timestamp}] [${level}] : [${userInfos}] [${routeType}] => [${message}]`;
});

const createRouteLogger = (routeType) => {
    return createLogger({
        level: 'info',
        format: format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            logFormat
        ),
        transports: [
            new DailyRotateFile({
                filename: `logs/${routeType}-%DATE%.log`,
                datePattern: 'YYYY-MM-DD',
                maxFiles: '15d',
                zippedArchive: false
            })
        ]
    });
};

const buildLogData = (userInfo, req, routeType) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    return {
        userInfos: `${userInfo || 'unknown'} | ${ip}`,
        routeType
    };
};


module.exports = {
    userLogger: createRouteLogger('user'),
    urlLogger: createRouteLogger('url'),
    apiLogger: createRouteLogger('api'),
    buildLogData
};
