import webpack from "webpack-stream";
import path from "path";
import fs from "fs";
import gulpESLintNew from "gulp-eslint-new";

export const js = () => {
	// Находим все файлы в папке js
	const files = fs.readdirSync(app.path.src.jsFiles);
	// Здесь будут храниться все входные точки
	const entryPoints = {};
	// Перебираем все файлы и находим только .js, записываем в объект входных точек
	files.forEach(file => {
		if (file.endsWith('.js')) {
			const entryName = path.parse(file).name;
			entryPoints[entryName] = `${app.path.src.jsFiles}${entryName}`;
		}
	});

	return app.gulp.src(app.path.src.js, { sourcemaps: app.isDev })
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: "JS",
				message: "Error: <%= error.message %>"
			}))
		)
		// Выполнение команд линтера
		.pipe(gulpESLintNew({ fix: true }))
		.pipe(gulpESLintNew.fix())
		.pipe(gulpESLintNew.format())
		.pipe(webpack({
			mode: app.isBuild ? 'production' : 'development',
			entry: entryPoints,
			output: {
				filename: '[name].min.js',
			},
		}))
		.pipe(app.gulp.dest(app.path.build.js))
		.pipe(app.plugins.browsersync.stream())
};