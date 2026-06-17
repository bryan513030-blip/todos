function errorHandle(response) {
  const header = {
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
    "Content-Type": "application/json",
  };
  response.writeHead(400, header);
  response.write(
    JSON.stringify({
      status: "false",
      message: "系統錯誤或title有問題或找不到id",
    }),
  );
  response.end();
}

module.exports = errorHandle;
