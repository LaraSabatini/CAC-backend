"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchArticles = exports.filterArticles = exports.getRelatedArticles = exports.getArticleById = exports.deleteArticle = exports.editArticle = exports.getArticles = exports.createArticle = void 0;
const index_1 = __importDefault(require("../database/index"));
const index_2 = __importDefault(require("../config/index"));
const statusCodes_1 = __importDefault(require("../config/statusCodes"));
const pagination_1 = require("../helpers/pagination");
const deleteDuplicates_1 = __importDefault(require("../helpers/deleteDuplicates"));
const createArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, createdBy, changesHistory, portrait, subtitle, regionFilters, themeFilters, article, attachments, author, } = req.body;
        const registerArticle = yield index_1.default.query(`INSERT INTO articles (
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
            return res.status(statusCodes_1.default.CREATED).json({
                message: "Article created successfully",
                status: statusCodes_1.default.CREATED,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "An error has occurred while creating the article, please try again.",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.createArticle = createArticle;
const getArticles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page } = req.params;
        const offset = pagination_1.getOffset(index_2.default.listPerPage, page);
        const [articles] = yield index_1.default.query(`SELECT * FROM articles LIMIT ${offset},${index_2.default.listPerPage}`);
        const [amountOfPages] = yield index_1.default.query(`SELECT COUNT(*) FROM articles`);
        if (articles) {
            const rowData = amountOfPages;
            const meta = {
                page,
                totalPages: parseInt(Object.keys(rowData)[0], 10),
            };
            return res.status(statusCodes_1.default.OK).json({
                data: articles,
                meta,
                status: statusCodes_1.default.OK,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "An error has occurred, please try again.",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.getArticles = getArticles;
const editArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, createdBy, changesHistory, portrait, subtitle, regionFilters, themeFilters, article, attachments, author, } = req.body;
        const { id } = req.params;
        const [articleEntry] = yield index_1.default.query(`UPDATE articles SET title = '${title}', description = '${description}', createdBy = '${createdBy}', changesHistory = '${changesHistory}',
      portrait = '${portrait}', subtitle = '${subtitle}', regionFilters = '${regionFilters}', themeFilters = '${themeFilters}',
      article = '${article}', attachments = '${attachments}', author = '${author}' WHERE id = ${id}`);
        if (articleEntry) {
            res.status(statusCodes_1.default.CREATED);
            res.send({
                message: "Article updated successfully",
                status: statusCodes_1.default.CREATED,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "An error has occurred while updating the article, please try again.",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.editArticle = editArticle;
const deleteArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [article] = yield index_1.default.query(`DELETE FROM articles WHERE id=${id}`);
        if (article) {
            res.status(statusCodes_1.default.OK);
            res.send({
                message: "Article deleted successfully",
                status: statusCodes_1.default.OK,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "An error has occurred while deleting the article, please try again.",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.deleteArticle = deleteArticle;
const getArticleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [article] = yield index_1.default.query(`SELECT * FROM articles WHERE id = '${id}'`);
        if (article) {
            return res.status(statusCodes_1.default.OK).json({
                data: article,
                status: statusCodes_1.default.OK,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "An error has occurred, please try again.",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.getArticleById = getArticleById;
const getRelatedArticles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { themeId, regionId } = req.params;
        const [relatedArticles] = yield index_1.default.query(`SELECT * FROM articles WHERE regionFilters LIKE '%${regionId}%' OR themeFilters LIKE '%${themeId}%' LIMIT 2`);
        if (relatedArticles) {
            return res.status(statusCodes_1.default.OK).json({
                data: relatedArticles,
                status: statusCodes_1.default.OK,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "An error has occurred, please try again.",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.getRelatedArticles = getRelatedArticles;
const filterArticles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { regionIds, themeIds } = req.body;
        let articles = [];
        for (let i = 0; i < regionIds.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            const [results] = yield index_1.default.query(`SELECT * FROM articles WHERE regionFilters LIKE '%${regionIds[i]}%'`);
            articles = [...articles, ...results];
        }
        for (let i = 0; i < themeIds.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            const [results] = yield index_1.default.query(`SELECT * FROM articles WHERE themeFilters LIKE '%${themeIds[i]}%'`);
            articles = [...articles, ...results];
        }
        if (articles) {
            return res.status(statusCodes_1.default.OK).json({
                data: articles,
                status: statusCodes_1.default.OK,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "An error has occurred, please try again.",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.filterArticles = filterArticles;
const searchArticles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search } = req.body;
        const [fromTitle] = yield index_1.default.query(`SELECT * FROM articles WHERE title LIKE '%${search}%'`);
        const [fromText] = yield index_1.default.query(`SELECT * FROM articles WHERE article LIKE '%${search}%'`);
        if (fromTitle && fromText) {
            return res.status(statusCodes_1.default.OK).json({
                data: deleteDuplicates_1.default([...fromText, ...fromTitle]),
                status: statusCodes_1.default.OK,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "An error has occurred, please try again.",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.searchArticles = searchArticles;
