FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY restaurant-service/pom.xml .
COPY restaurant-service/src ./src
RUN mvn clean package -DskipTests
RUN ls target/
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/restaurant-service-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8083
ENTRYPOINT ["java", "-jar", "app.jar"]
