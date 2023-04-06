export class FormConfig {
    constructor(config = {}, formId = '') {
        this.id = config.id;
        this.content = config.content;
        this.image = config.image;
        this.formId = formId;
        this.completed = false;
    }
}