"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTodoWithClassValidator = exports.TodoItem = void 0;
const class_validator_1 = require("class-validator");
class TodoItem {
    constructor(data) {
        if (data === undefined) {
            data = {};
        }
        this.text = data.text;
    }
}
__decorate([
    (0, class_validator_1.MinLength)(2, {
        message: 'Todo is too short. Minimal length is $constraint1 characters, you typed $value',
    }),
    (0, class_validator_1.IsNotEmpty)({
        message: 'Todo cannot be empty',
    }),
    __metadata("design:type", String)
], TodoItem.prototype, "text", void 0);
exports.TodoItem = TodoItem;
const validateTodoWithClassValidator = async (todo) => {
    return (0, class_validator_1.validate)(todo).then((errors) => {
        return errors.length > 0 ? errors : [];
    });
};
exports.validateTodoWithClassValidator = validateTodoWithClassValidator;
