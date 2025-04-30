function setupLogin() {
    console.log("Sistema de Controle para Professores")

    // LOGIN DO GOOGLE
    window.handleGoogleLogin = function (response) {
        const token = response.credential

        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: token }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.token && data.name && data.photo) {
                    // Armazenar o token e as informações do usuário no localStorage
                    localStorage.setItem("authToken", data.token)
                    localStorage.setItem(
                        "userInfo",
                        JSON.stringify({
                            name: data.name,
                            photo: data.photo,
                        })
                    )

                    // Redireciona para o painel
                    window.location.href = "painel.html"
                } else {
                    alert("Falha na autenticação")
                }
            })
            .catch((err) => {
                console.log("Erro ao autenticar: ", err)
                location.reload()
            })
    }
}

setupLogin()
