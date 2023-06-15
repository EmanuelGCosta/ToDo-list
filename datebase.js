const mongo = require("mongoose");


module.exports = class {
    constructor() {
        main().catch(err => console.log(err));
        async function main() {
            await mongo.connect('mongodb://127.0.0.1:27017/todolistDB');
        };
        const itemsSchema = new mongo.Schema({
            name: String
        });
        this.Item = mongo.model("Item", itemsSchema);

        const listSchema = new mongo.Schema({
            name: String,
            items: [itemsSchema]
        });
        this.List = mongo.model("List", listSchema);
    };

    inserirVarios(array) {
        this.Item.insertMany(array)
            .then((event) => {
                console.log("Seu array foi adicionado! ");
            })
            .catch((err) => {
                console.log(err);
            });
    };

    deletaUm(id) {
        this.Item.deleteOne({ _id: id })
            .then((event) => {
                console.log("Seu item foi deletado " + event);
            })
            .catch((err) => {
                console.log(err);
            });
    };

};