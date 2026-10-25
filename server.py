import http.server
import socketserver
import os

import socket

def get_available_port(default_port=8081):
    env_port = os.environ.get('PORT')
    if env_port:
        return int(env_port)
    for p in [8081, 8082, 8085, 8080]:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(('', p))
                return p
            except OSError:
                continue
    return default_port

PORT = get_available_port(8081)
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Force mobile browsers to never cache CSS/JS during development
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

# Allow fast address reuse
socketserver.TCPServer.allow_reuse_address = True

if __name__ == '__main__':
    with socketserver.TCPServer(("", PORT), NoCacheHandler) as httpd:
        print(f"Server running with NoCacheHandler at http://0.0.0.0:{PORT}")
        httpd.serve_forever()
