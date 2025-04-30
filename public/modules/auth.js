export function verificarLoginOuRedirecionar() {
    const token = localStorage.getItem("authToken")

    if (!token) {
        window.location.href = "index.html"
    } else {
        fetch("/verificar-token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (!data.valido) {
                    localStorage.removeItem("authToken")
                    window.location.href = "index.html"
                }
            })
            .catch(() => {
                localStorage.removeItem("authToken")
                window.location.href = "index.html"
            })
    }
}

export function redirecionarSeLogado() {
    const token = localStorage.getItem("authToken")

    if (token) {
        fetch("/verificar-token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.valido) {
                    window.location.href = "painel.html"
                }
            })
    }
}
