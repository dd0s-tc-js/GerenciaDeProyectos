function transaccion() {
	let operation = $("#operation").val();
	let amount = $("#amount").val();
	let body = { amount: amount };
	fetch(operation, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	})
		.then((response) => response.json())
		.then((data) => {
            swal({
                title: "Operación Exitosa",
                text: "Revisa el nuevo saldo de tu cuenta.",
                icon: "success",
                button: "OK",
            });
            $("#saldo").text("Tu saldo actual es de $"+data);
		})
		.catch((error) => {
			console.error(error);
		});
}
