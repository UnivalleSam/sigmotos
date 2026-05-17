package com.sigmotos.workshopservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class WorkshopServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(WorkshopServiceApplication.class, args);
	}

}
