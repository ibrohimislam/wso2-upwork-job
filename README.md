#  Auth Starter Kit

frontend: http://localhost:8080
backend: http://localhost:9001,http://localhost:9002,http://localhost:9003
keycloak: http://localhost:7000 (master user: dev password: dev)

### SettingUp Backend NodeJS Module
1. `cd backend`
2. `yarn install`

### Build Frontend
1. `cd frontend`
2. `yarn install`
3. `yarn build`

### Start
1. `docker-compose up -d`
2. create user at ehealth-dev realms
3. open frontend at http://localhost:8080

### Change Frontend Endpoint
1. open file frontend/src/components/my-view1/my-view1.component.ts
2. rebuild
3. `docker-compose up -d --build frontend`