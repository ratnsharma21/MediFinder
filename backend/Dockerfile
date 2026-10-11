FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder

WORKDIR /build

COPY pom.xml .
RUN mvn dependency:go-offline -B || mvn dependency:resolve -B

COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine AS runner

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY --from=builder --chown=appuser:appgroup /build/target/*.jar /app/app.jar

ENV JAVA_OPTS="-XX:+UseContainerSupport \
               -XX:MaxRAMPercentage=75.0 \
               -XX:InitialRAMPercentage=50.0 \
               -XX:+UseG1GC \
               -Djava.security.egd=file:/dev/./urandom \
               -Djava.awt.headless=true \
               -XX:+ExitOnOutOfMemoryError"

ENV SERVER_PORT=8080

EXPOSE 8080

USER appuser

ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar /app/app.jar"]
