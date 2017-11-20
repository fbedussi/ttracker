const commandManager = {
    _history: [],
    _currentActionIndex: -1,
    _app: null,
    getApp: function() {
        return this._app;
    },
    createAction: function(doAction, undoAction, deferredUndoData = false) {
        const actionObj = {
            do: {
                actionName: doAction[0],
                data: doAction.slice(1),
            },
            deferredUndoData,
        };

        if (undoAction) {
            Object.assign(actionObj, {
                undo: {
                    actionName: undoAction[0],
                    data: undoAction.slice(1),
                },
            })
        }

        return actionObj;
    },
    _execute: function(appMethodName, appMethodArgs) {
        return this._app[appMethodName].apply(this._app, appMethodArgs); //concat is to ensure that ... operates on an array even if appMethodArgs is undefined
    }, 
    undo: function() {
        const lastAction = this._history[this._currentActionIndex];

        if (!lastAction) {
            return null;
        }

        var returnedData;

        lastAction
            //.reverse()
            .forEach((subaction) => returnedData = this._execute(subaction.undo.actionName, subaction.undo.data))
        ;
        this._currentActionIndex = this._currentActionIndex - 1;
        
        return returnedData;
    },
    redo: function() {
        const nextActionIndex = this._currentActionIndex + 1;
        const nextAction = this._history[nextActionIndex];
        
        if (!nextAction) {
            return null;
        }

        var returnedData;
        
        nextAction.forEach((subaction) => returnedData = this._execute(subaction.do.actionName, subaction.do.data));
        this._currentActionIndex = nextActionIndex;

        return returnedData;        
    },
    execute: function(action) {
        this._currentActionIndex = this._currentActionIndex + 1;
        if (this._currentActionIndex < this._history.length) {
            this._history = this._history.slice(0,this._currentActionIndex);
        }
        this._history = this._history.concat([[action]]);

        const returnedData = this._execute(action.do.actionName, action.do.data);
        
        if (!action.undo) {
            return returnedData;
        }
        
        if (action.deferredUndoData) {
            action.undo.data = returnedData;
        }

        return returnedData;
    },
    init: function(app) {
        this._app = app;

        return this;
    }
};

export default function getCommandManager(app) {
    return commandManager.app ? commandManager : commandManager.init(app);
}