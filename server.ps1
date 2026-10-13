# server.ps1 — servidor local para testar o site da Casa das Tendas
# Uso:  powershell -ExecutionPolicy Bypass -File server.ps1 [-Porta 8080]
# Depois abra http://localhost:8080/ no navegador.

param(
    [int]$Porta = 8080
)

$raiz = Split-Path -Parent $MyInvocation.MyCommand.Path
$prefixo = "http://localhost:$Porta/"

$servidor = New-Object System.Net.HttpListener
$servidor.Prefixes.Add($prefixo)
$servidor.Start()

$tipos = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".png"  = "image/png"
    ".svg"  = "image/svg+xml"
    ".mp4"  = "video/mp4"
    ".ico"  = "image/x-icon"
    ".xml"  = "application/xml; charset=utf-8"
    ".txt"  = "text/plain; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".webp" = "image/webp"
}

Write-Host "Servindo $raiz em $prefixo  (Ctrl+C para parar)"

try {
    while ($servidor.IsListening) {
        $contexto = $servidor.GetContext()
        $requisicao = $contexto.Request
        $resposta = $contexto.Response

        try {
            $caminho = [Uri]::UnescapeDataString($requisicao.Url.AbsolutePath).TrimStart("/")
            if ($caminho -eq "" -or $caminho.EndsWith("/")) { $caminho += "index.html" }

            $arquivo = Join-Path $raiz $caminho
            # bloqueia acesso fora da pasta do site
            if (-not $arquivo.StartsWith($raiz, [System.StringComparison]::OrdinalIgnoreCase)) {
                $resposta.StatusCode = 403
                $resposta.Close()
                continue
            }

            if (Test-Path $arquivo -PathType Leaf) {
                $bytes = [IO.File]::ReadAllBytes($arquivo)
                $ext = [IO.Path]::GetExtension($arquivo).ToLower()
                if ($tipos.ContainsKey($ext)) { $resposta.ContentType = $tipos[$ext] }
                $resposta.ContentLength64 = $bytes.Length
                $resposta.OutputStream.Write($bytes, 0, $bytes.Length)
            }
            else {
                $resposta.StatusCode = 404
                $msg = [Text.Encoding]::UTF8.GetBytes("<h1>404 - nao encontrado</h1>")
                $resposta.ContentType = "text/html; charset=utf-8"
                $resposta.OutputStream.Write($msg, 0, $msg.Length)
            }
        }
        catch {
            $resposta.StatusCode = 500
        }
        finally {
            $resposta.Close()
        }
    }
}
finally {
    $servidor.Stop()
}
