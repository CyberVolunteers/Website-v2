import { createLogger, format, transports } from "winston"
import getConfig from "next/config";

// from https://github.com/winstonjs/winston/blob/master/examples/quick-start.js

const { publicRuntimeConfig } = getConfig();

export const logger = (() => {
	const out = createLogger({
		level: "info",
		format: format.combine(
			format.timestamp({
				format: 'YYYY-MM-DD HH:mm:ss'
			}),
			format.errors({ stack: true }),
			format.splat(),
			format.json()
		),
		transports: [
			new transports.File({ filename: `${process.env.baseDir}/logs/next.error.log`, level: 'error' }),
			new transports.File({ filename: `${process.env.baseDir}/logs/next.combined.log` })
		]
	});

	//
	// If we're not in production then **ALSO** log to the stout
	// with the colorized simple format.
	//
	if (publicRuntimeConfig.IS_DEV !== 'production') {
		out.add(new transports.Console({
			format: format.combine(
				format.colorize(),
				format.simple()
			)
		}));
	}

	return out;
})()
