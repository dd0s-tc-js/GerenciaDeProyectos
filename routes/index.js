const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const router = express.Router();
// Database connection
const db = new sqlite3.Database("bank.db");

// Crea la tabla 'transactions' en la base de datos si no existe
db.run(
  "CREATE TABLE IF NOT EXISTS cuenta (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, amount INTEGER)"
);
db.run(
  "CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, fullName TEXT, tipoDoc TEXT , docNumber TEXT ,  password TEXT )"
);
db.run(
  "CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, amount INTEGER, date TEXT)"
);


// Login route
router.get("/", (req, res) => {
  res.sendFile("login.html", { root: "./views/login" });
});
router.post("/login", async (req, res) => {
  try {
    const docNumber = req.body.docNumber;
    const password = req.body.pass;
    db.get("SELECT u.cuenta FROM user AS u WHERE u.docNumber=? AND u.password=?",[docNumber,password],(error, row) => {
        if (error) {
          console.error(err);
          res.status(401).json({ error: err.message });
        } else {
          let cuenta = row.cuenta;
          req.session.cuenta = cuenta;
          db.get("SELECT c.amount FROM cuenta as c WHERE c.id = ?",[cuenta],(error, row) => {
              if (error) {
                console.error(error.message);
                return 0;
              } else {
                res.render("./management/management", {
                  saldo: row.amount,
                });
              }
            }
          );
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: err.message });
  }
});

// Deposit route
router.post("/deposit", async (req, res) => {
  try {
    let cuenta = req.session.cuenta;
    db.get('SELECT c.amount FROM cuenta as c WHERE c.id = ?', [cuenta], (err, row1) =>{
      if (err) {
        console.error(err);
        res.status(500).send("Error al actualizar el usuario");
      } else {
        let newAmount = row1.amount + Number(req.body.amount);
        const sql = 'UPDATE cuenta SET amount = ? WHERE id= ?';
        db.run(sql, [newAmount, cuenta], function (err) {
          if (err) {
            console.error(err);
            res.status(500).send("Error al actualizar el usuario");
          } else {
            db.get("SELECT c.amount FROM cuenta as c WHERE c.id = ?", [cuenta], (error, row) => {
                if (error) {
                  console.error(error.message);
                  return 0;
                } else {
                  res.json(row.amount);
                }
              }
            );
          }
        });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// Withdraw route
router.post("/withdraw", async (req, res) => {
  try {
    let cuenta = req.session.cuenta;
    db.get('SELECT c.amount FROM cuenta as c WHERE c.id = ?', [cuenta], (err, row1) =>{
      if (err) {
        console.error(err);
        res.status(500).send("Error al actualizar el usuario");
      } else {
        let newAmount = row1.amount - Number(req.body.amount);
        const sql = 'UPDATE cuenta SET amount = ? WHERE id= ?';
        db.run(sql, [newAmount, cuenta], function (err) {
          if (err) {
            console.error(err);
            res.status(500).send("Error al actualizar el usuario");
          } else {
            db.get("SELECT c.amount FROM cuenta as c WHERE c.id = ?", [cuenta], (error, row) => {
                if (error) {
                  console.error(error.message);
                  return 0;
                } else {
                  res.json(row.amount);
                }
              }
            );
          }
        });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
