import http from "node:http";

const server = http.createServer((req, clientRes) => {
  const options = {
    hostname: "127.0.0.1",
    port: 5173,
    path: req.url,
    method: req.method,
    headers: { ...req.headers, host: "localhost:5173" },
  };

  const proxyReq = http.request(options, (proxyRes) => {
    clientRes.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
    proxyRes.pipe(clientRes, { end: true });
  });

  proxyReq.on("error", (err) => {
    clientRes.writeHead(502, { "Content-Type": "text/plain" });
    clientRes.end("Waiting for Vite dev server on port 5173: " + err.message);
  });

  req.pipe(proxyReq, { end: true });
});

server.listen(3000, () => {
  console.log("Port 3000 proxy active -> forwarding all traffic to http://localhost:5173");
});
