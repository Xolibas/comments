import {makeAutoObservable} from "mobx";

export default class CommentStore {
    constructor() {
        this._comments = []
        this._page = 1
        this._totalCount = 0
        this._limit = 13
        makeAutoObservable(this)
    }

    setComments(comments) {
        this._comments = comments
    }

    setPage(page) {
        this._page = page
    }
    setTotalCount(count) {
        this._totalCount = count
    }

    get comments() {
        return this._comments
    }

    get totalCount() {
        return this._totalCount
    }

    get page() {
        return this._page
    }

    get limit() {
        return this._limit
    }
}
