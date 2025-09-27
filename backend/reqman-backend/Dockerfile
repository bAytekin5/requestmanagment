FROM eclipse-temurin:21-jre

ARG JAR_FILE=target/reqman-backend-0.0.1-SNAPSHOT.jar
ARG APP_HOME=/app

RUN mkdir -p ${APP_HOME}
WORKDIR ${APP_HOME}

COPY ${JAR_FILE} app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","/app/app.jar"]

