FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY client-service/pom.xml .
COPY client-service/src ./src
RUN mvn clean package -DskipTests -U

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/client-service-0.0.2-SNAPSHOT.jar app.jar
ENTRYPOINT ["sh", "-c", "java -jar app.jar --server.port=${PORT:-8089}"]
