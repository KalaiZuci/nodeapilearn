const { verify } = require("crypto");
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const mysqlConnection = require("./db.js");
// const controller = require('./contorller.js');

function verifyToken(req) {
  const token = req.headers["token"];
  const verified = jwt.verify(token, "JWT_SECRET_KEY");
  return verified;
}

router.get("/login/:username/:password", function (req, res) {
  console.log(req.params);
  var name = req.params.username;
  var password = req.params.password;
  var sql =
    'select * from admin where name="' +
    name +
    '" and password="' +
    password +
    '"';
  mysqlConnection.query(sql, function (err, result, fields) {
    if (!err) {
      let userCount = result.length;
      if (userCount === 0) {
        let statusCode = 400;
        var response = {
          statusCode: statusCode,
          message: "User not exist",
        };
        res.status(statusCode).send(response);
      } else {
        let userId = result[0].id;
        let userName = result[0].name;
        const JWT_SECRET_KEY = process.env.JWT_SECERET_KEY;
        console.log(JWT_SECRET_KEY);
        const token = jwt.sign(
          { userId: userId, userName: userName },
          "JWT_SECRET_KEY",
          { expiresIn: "1h" }
        );
        var response = {
          statusCode: 200,
          message: "Logged in successfully",
          token: token,
        };
        console.log(result, userId);
        res.status(200).send(response);
      }
    } else {
      throw err;
    }
  });
});

router.get("/employee", function (req, res) {
  try {
    verifyToken(req, function (err) {
      if (!err) {
        var sql = "select * from employee";
        mysqlConnection.query(sql, function (err, result, fields) {
          if (!err) {
            res.json(result);
          } else {
            throw err;
          }
        });
      }
    });
  } catch (err) {
    res.status(401).send("UnAuthorized - " + err);
  }

  // if(verifyToken(req)){
  //     var sql = 'select * from employee';
  //     mysqlConnection.query(sql, function(err, result, fields){
  //         if (!err) {
  //             res.json(result);
  //         } else{
  //             throw err;
  //         }
  //     });
  // }else{
  //     res.status(401).send('UnAuthorized');
  // }
});

router.post("/employee", function (req, res) {
  var name = req.body.name;
  var salary = req.body.salary;
  var sql =
    'insert into employee (name, salary) values("' +
    name +
    '", "' +
    salary +
    '")';
  mysqlConnection.query(sql, function (err, result) {
    if (!err) {
      res.send(name + " inserted successfully");
    } else {
      throw err;
    }
  });
});

router.delete("/employee", function (req, res) {
  var sql = "delete from employee";
  mysqlConnection.query(sql, function (err, result, fields) {
    if (!err) {
      res.send(result.affectedRows + " records deleted");
    } else {
      throw err;
    }
  });
});

router.get("/employee/:id", function (req, res) {
  var id = req.params.id;
  var sql = "select * from employee where id=" + id;
  mysqlConnection.query(sql, function (err, result, fields) {
    if (!err) {
      res.json(result);
    } else {
      throw err;
    }
  });
});

router.delete("/employee/:id", function (req, res) {
  var id = req.params.id;
  var sql = "delete from employee where id = " + id;
  mysqlConnection.query(sql, function (err, result, fields) {
    if (!err) {
      res.send("Employee id " + id + " deleted");
    } else {
      throw err;
    }
  });
});

router.put("/employee/:id", function (req, res) {
  var id = req.params.id;
  var name = req.body.name;
  var salary = req.body.salary;
  var sql =
    'update employee set name="' +
    name +
    '", salary="' +
    salary +
    '" where id = ' +
    id;
  mysqlConnection.query(sql, function (err, result, fields) {
    if (!err) {
      res.send("Employee id " + id + " Updated");
    } else {
      throw err;
    }
  });
});

router.patch("/employee/:id", function (req, res) {
  var id = req.params.id;
  var data = req.body;
  var querystr = "";
  var cnt = 0;
  for (var i in data) {
    if (cnt === 0) {
      querystr = i + '="' + data[i] + '"';
    } else {
      querystr = querystr + ", " + i + '="' + data[i] + '"';
    }
    cnt++;
  }
  var sql = "update employee set " + querystr + " where id = " + id;
  mysqlConnection.query(sql, function (err, result, fields) {
    if (!err) {
      res.send("Employee id " + id + " Updated - " + sql);
    } else {
      throw err;
    }
  });
});

module.exports = router;
