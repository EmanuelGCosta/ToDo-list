const express = require("express");
const mongoose = require(__dirname + "/datebase");
const app = express();

const mongo = new mongoose();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const item1 = new mongo.Item({name: "Bem vindo ao seu 'ToDoList'!"});
const item2 = new mongo.Item({name: "Aperte '+' para adicionar um novo item."});
const item3 = new mongo.Item({name: "<-- Aperte aqui para deletar um item."})

const defaultItem = [item1, item2, item3];

mongo.Item.find()
    .then((event) => {
        if (event.length === 0) {
            mongo.inserirVarios(defaultItem);
        }
    });


/////GET ROUTES/////


app.get("/", (req, res) => {

    mongo.Item.find()
        .then((event) => {
                res.render("list", {
                    listTitle: "Hoje",
                    items: event
                });
        })
        .catch((err) => {
            console.log("errou" + err);
        })
});

app.get("/:paramName", (req, res) => {
    const customListName = req.params.paramName;

    mongo.List.findOne({ name: customListName })
        .then((event) => {
            if (customListName != "favicon.ico") {
                console.log(event);
                if (!event) {
                    const list = new mongo.List({name: customListName, items: defaultItem});
                    list.save();
                    res.redirect("/" + customListName);
                } else {
                    res.render("list", {
                        listTitle: event.name,
                        items: event.items
                    });
                }
            }
        })
        .catch((err) => {
            console.log(err)
        });
});

//Redirecionando para home caso usuário entre na rota /delete sem querer
app.get("/delete", (req, res) => { res.redirect("/") });


/////POST ROUTES/////


//adicionando tarefa
app.post("/", async (req, res) => {
    const listName = req.body.list;
    const item = new mongo.Item({name: req.body.newItem});

    if (listName === "Hoje") {
        item.save();
        res.redirect("/");
    } else {
        await mongo.List.updateOne(
            { name: listName },
            { $push: { items: item } }
        );
        res.redirect("/" + listName);
    }
});

//deletando tarefas
app.post("/delete", async (req, res) => {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Hoje") {
        mongo.deletaUm(checkedItemId);
        res.redirect("/");

    } else {
        await mongo.List.updateOne(
            { name: listName },
            { $pull: { items: { _id: checkedItemId } } }
        );
        res.redirect("/" + listName);
    }
});


app.listen(3000);