package com.sigmotos.ocrservice.client;

import com.sigmotos.ocrservice.dto.VehicleDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "workshop-service", url = "http://localhost:8083")
public interface WorkshopClient {

    @GetMapping("/api/vehicles/search")
    VehicleDTO searchByPlate(@RequestParam("plate") String plate);
}
