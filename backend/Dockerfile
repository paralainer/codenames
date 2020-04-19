FROM maven:3.6.3-jdk-13 AS build
COPY src /usr/src/app/src
COPY pom.xml /usr/src/app
RUN mvn -f /usr/src/app/pom.xml clean package

FROM adoptopenjdk/openjdk13:alpine-jre
COPY --from=build /usr/src/app/target/codenames-back.jar /usr/app/codenames-back.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/usr/app/codenames-back.jar"]