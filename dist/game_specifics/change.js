export var UpdateType;
(function (UpdateType) {
    UpdateType[UpdateType["UpdateSet"] = 0] = "UpdateSet";
    // list type operation
    UpdateType[UpdateType["UpdateAdd"] = 1] = "UpdateAdd";
    UpdateType[UpdateType["UpdateRemove"] = 2] = "UpdateRemove";
    // whole object type operation
    UpdateType[UpdateType["UpdateCreate"] = 3] = "UpdateCreate";
    UpdateType[UpdateType["UpdateDestroy"] = 4] = "UpdateDestroy";
})(UpdateType || (UpdateType = {}));
//# sourceMappingURL=change.js.map