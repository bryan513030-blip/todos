const http = require("http");
const { v4: uuidv4 } = require("uuid");
const errorHandle = require("./errorHandle");
const todos = []; // 待辦清單

const requestListener = (request, response) => {
  const header = {
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
    "Content-Type": "application/json",
  };
  // 接收POST、PATCH來的資料
  let body = "";
  request.on("data", (chunk) => {
    body += chunk;
  });

  // GET 取得待辦清單todos
  if (request.url == "/todos" && request.method == "GET") {
    response.writeHead(200, header);
    response.write(
      JSON.stringify({
        status: "success",
        data: todos,
      }),
    );
    response.end();
    // POST 刪除全部待辦清單todos
  }

  // DELETE 刪除待辦清單todos
  else if (request.url == "/todos" && request.method == "DELETE") {
    todos.length = 0;
    response.writeHead(200, header);
    response.write(
      JSON.stringify({
        status: "success",
        data: todos,
      }),
    );
    response.end();
  }

  // DELETE 刪除單筆待辦清單todos/id
  else if (request.url.startsWith("/todos/") && request.method == "DELETE") {
    const id = request.url.split("/").pop();
    const index = todos.findIndex(function (item) {
      return item.id == id;
    });
    if (index !== -1) {
      todos.splice(index, 1);
      response.writeHead(200, header);
      response.write(
        JSON.stringify({
          status: "success",
          data: todos,
        }),
      );
      response.end();
    } else {
      errorHandle(response);
    }
  }
  // POST 新增一筆待辦清單todos
  else if (request.url == "/todos" && request.method == "POST") {
    //如果POST來的資料接收完了
    request.on("end", () => {
      try {
        const title = JSON.parse(body).title;
        if (title !== undefined) {
          const todo = {
            title: title,
            id: uuidv4(),
          };
          //將欲新增的待辦事項加入todos
          todos.push(todo);
          response.writeHead(200, header);
          response.write(
            JSON.stringify({
              status: "success",
              data: todos,
            }),
          );
          response.end();
        } else {
          errorHandle(response);
        }
      } catch (error) {
        errorHandle(response);
        response.end();
      }
    });
  }

  // patch 編輯一筆待辦清單todos/id
  else if (request.url.startsWith("/todos/") && request.method == "PATCH") {
    //如果PATCH來的資料接收完了
    request.on("end", () => {
      try {
        const todo = JSON.parse(body).title;
        const id = request.url.split("/").pop();
        const index = todos.findIndex((item) => item.id == id);
        if (todo !== undefined && index !== -1) {
          todos[index].title = todo;
          response.writeHead(200, header);
          response.write(
            JSON.stringify({
              status: "success",
              data: todos,
            }),
          );
        } else {
          errorHandle(response);
        }
        response.end();
      } catch (error) {
        errorHandle(response);
        response.end();
      }
    });
  }

  // options 跨網域請求：先需取得請求方式
  else if (request.url == "/todos" && request.method == "options") {
    response.writeHead(200, header);
    response.write("options success");
    response.end();
    // 請求錯誤
  } else {
    errorHandle(response);
  }
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005);
