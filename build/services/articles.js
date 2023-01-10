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
import { getOffset } from "../helpers/pagination";
const createArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, categories, picture, attachment, createdBy, changesHistory, } = req.body;
        const registerArticle = yield pool.query(`INSERT INTO articles (
        title,
        description,
        categories,
        picture,
        attachment,
        createdBy,
        changesHistory) VALUES ('${title}', '${description}', '${categories}', '${picture}', '${attachment}', '${createdBy}', '${changesHistory}');`);
        if (registerArticle) {
            return res
                .status(201)
                .json({ message: "Article created successfully", status: 201 });
        }
    }
    catch (error) {
        return res.status(500).json({
            message: "An error has occurred while creating the article, please try again.",
            status: 500,
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
            return res.status(200).json({
                data: articles,
                meta,
                status: 200,
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            message: "An error has occurred, please try again.",
            status: 500,
        });
    }
    return {};
});
const editArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, categories, picture, attachment, createdBy, changesHistory, } = req.body;
        const { id } = req.params;
        const [article] = yield pool.query(`UPDATE article SET title = '${title}', description = '${description}', categories = '${categories}', picture = '${picture}', attachment = '${attachment}', createdBy = '${createdBy}', changesHistory = '${changesHistory}' WHERE id = ${id}`);
        if (article) {
            res.status(201);
            res.send({ message: "Article updated successfully", status: 201 });
        }
    }
    catch (error) {
        return res.status(500).json({
            message: "An error has occurred while updating the article, please try again.",
            status: 500,
        });
    }
    return {};
});
const deleteArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [article] = yield pool.query(`DELETE FROM articles WHERE id=${id}`);
        if (article) {
            res.status(200);
            res.send({ message: "Article deleted successfully", status: 200 });
        }
    }
    catch (error) {
        return res.status(500).json({
            message: "An error has occurred while deleting the article, please try again.",
            status: 500,
        });
    }
    return {};
});
export { createArticle, getArticles, editArticle, deleteArticle };
