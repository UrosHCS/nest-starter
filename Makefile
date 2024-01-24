enter-mysql:
	docker exec -it mysql mysql -u root -proot nest

enter-app:
	docker exec -it app bash

repl:
	docker exec -it app npm run repl

jest:
	docker exec -it app npm run test