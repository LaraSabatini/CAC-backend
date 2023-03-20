var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import pool from "../database/index";
import config from "../config/index";
import statusCodes from "../config/statusCodes";
import { getOffset } from "../helpers/pagination";
import deleteDuplicates from "../helpers/deleteDuplicates";
const createArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, createdBy, changesHistory, portrait, subtitle, regionFilters, themeFilters, article, attachments, author, } = req.body;
        const registerArticle = yield pool.query(`INSERT INTO articles (
        title,
        description,
        createdBy,
        changesHistory, 
        portrait,
        subtitle,
        regionFilters, 
        themeFilters, 
        article,
        attachments, 
        author) VALUES ('${title}', '${description}', '${createdBy}', '${changesHistory}', '${portrait}','${subtitle}', '${regionFilters}',
        '${themeFilters}', '${article}', '${attachments}','${author}');`);
        if (registerArticle) {
            return res.status(statusCodes.CREATED).json({
                message: "Article created successfully",
                status: statusCodes.CREATED,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            message: "An error has occurred while creating the article, please try again.",
            status: statusCodes.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
const getArticles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page } = req.params;
        const offset = getOffset(config.listPerPage, page);
        const [articles] = yield pool.query(`SELECT * FROM articles LIMIT ${offset},${config.listPerPage}`);
        const [amountOfPages] = yield pool.query(`SELECT COUNT(*) FROM articles`);
        if (articles) {
            const rowData = amountOfPages;
            const meta = {
                page,
                totalPages: parseInt(Object.keys(rowData)[0], 10),
            };
            return res.status(statusCodes.OK).json({
                data: articles,
                meta,
                status: statusCodes.OK,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            message: "An error has occurred, please try again.",
            status: statusCodes.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
const editArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, createdBy, changesHistory, portrait, subtitle, regionFilters, themeFilters, article, attachments, author, } = req.body;
        const { id } = req.params;
        const [articleEntry] = yield pool.query(`UPDATE articles SET title = '${title}', description = '${description}', createdBy = '${createdBy}', changesHistory = '${changesHistory}',
      portrait = '${portrait}', subtitle = '${subtitle}', regionFilters = '${regionFilters}', themeFilters = '${themeFilters}',
      article = '${article}', attachments = '${attachments}', author = '${author}' WHERE id = ${id}`);
        if (articleEntry) {
            res.status(statusCodes.CREATED);
            res.send({
                message: "Article updated successfully",
                status: statusCodes.CREATED,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            message: "An error has occurred while updating the article, please try again.",
            status: statusCodes.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
const deleteArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [article] = yield pool.query(`DELETE FROM articles WHERE id=${id}`);
        if (article) {
            res.status(statusCodes.OK);
            res.send({
                message: "Article deleted successfully",
                status: statusCodes.OK,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            message: "An error has occurred while deleting the article, please try again.",
            status: statusCodes.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
const getArticleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [article] = yield pool.query(`SELECT * FROM articles WHERE id = '${id}'`);
        if (article) {
            return res.status(statusCodes.OK).json({
                data: article,
                status: statusCodes.OK,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            message: "An error has occurred, please try again.",
            status: statusCodes.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
const getRelatedArticles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { themeId, regionId } = req.params;
        const [relatedArticles] = yield pool.query(`SELECT * FROM articles WHERE regionFilters LIKE '%${regionId}%' OR themeFilters LIKE '%${themeId}%' LIMIT 2`);
        if (relatedArticles) {
            return res.status(statusCodes.OK).json({
                data: relatedArticles,
                status: statusCodes.OK,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            message: "An error has occurred, please try again.",
            status: statusCodes.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
const filterArticles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { regionIds, themeIds } = req.body;
        let articles = [];
        for (let i = 0; i < regionIds.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            const [results] = yield pool.query(`SELECT * FROM articles WHERE regionFilters LIKE '%${regionIds[i]}%'`);
            articles = [...articles, ...results];
        }
        for (let i = 0; i < themeIds.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            const [results] = yield pool.query(`SELECT * FROM articles WHERE themeFilters LIKE '%${themeIds[i]}%'`);
            articles = [...articles, ...results];
        }
        if (articles) {
            return res.status(statusCodes.OK).json({
                data: articles,
                status: statusCodes.OK,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            message: "An error has occurred, please try again.",
            status: statusCodes.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
const searchArticles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search } = req.body;
        const [fromTitle] = yield pool.query(`SELECT * FROM articles WHERE title LIKE '%${search}%'`);
        const [fromText] = yield pool.query(`SELECT * FROM articles WHERE article LIKE '%${search}%'`);
        if (fromTitle && fromText) {
            return res.status(statusCodes.OK).json({
                data: deleteDuplicates([...fromText, ...fromTitle]),
                status: statusCodes.OK,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            message: "An error has occurred, please try again.",
            status: statusCodes.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
export { createArticle, getArticles, editArticle, deleteArticle, getArticleById, getRelatedArticles, filterArticles, searchArticles, };
