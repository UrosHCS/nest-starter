enter-mysql:
	docker exec -it mysql mysql -u root -proot nest

enter-app:
	docker exec -it app bash

ard:
	docker exec -it app npm run ard

jest:
	docker exec -it app npm run test