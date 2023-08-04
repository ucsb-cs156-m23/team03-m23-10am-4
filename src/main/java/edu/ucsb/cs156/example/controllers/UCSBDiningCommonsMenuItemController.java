package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.entities.UCSBDiningCommonsMenuItem;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.repositories.UCSBDiningCommonsMenuItemRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;

import com.fasterxml.jackson.core.JsonProcessingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

import javax.validation.Valid;

@Tag(name = "UCSBDiningCommonsMenuItem")
@RequestMapping("/api/UCSBDiningCommonsMenuItem")
@RestController
@Slf4j
public class UCSBDiningCommonsMenuItemController extends ApiController{

    @Autowired
    UCSBDiningCommonsMenuItemRepository ucsbDiningCommonsMenuItemRepository;

    @Operation(summary= "List all UCSB Dining Commons Menu Items")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<UCSBDiningCommonsMenuItem> allUCSBDiningCommonsMenuItems() {
        Iterable<UCSBDiningCommonsMenuItem> uCSBDiningCommonsMenuItem = ucsbDiningCommonsMenuItemRepository.findAll();
        return uCSBDiningCommonsMenuItem;
    }

    @Operation(summary= "Get a single UCSB Dining Commons Menu Item")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public UCSBDiningCommonsMenuItem getById(
            @Parameter(name="id") @RequestParam Long id) {
                UCSBDiningCommonsMenuItem uCSBDiningCommonsMenuItem = ucsbDiningCommonsMenuItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(UCSBDiningCommonsMenuItem.class, id));

        return uCSBDiningCommonsMenuItem;
    }

    @Operation(summary= "Create a new UCSB Dining Commons Menu Item")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/post")
    public UCSBDiningCommonsMenuItem postUCSBDiningCommonsMenuItem(
        @Parameter(name="diningCommonsCode") @RequestParam String diningCommonsCode,
        @Parameter(name="name") @RequestParam String name,
        @Parameter(name="station") @RequestParam String station) 
        throws JsonProcessingException {

            UCSBDiningCommonsMenuItem uCSBDiningCommonsMenuItem = new UCSBDiningCommonsMenuItem();

            uCSBDiningCommonsMenuItem.setDiningCommonsCode(diningCommonsCode);
            uCSBDiningCommonsMenuItem.setName(name);
            uCSBDiningCommonsMenuItem.setStation(station);


            UCSBDiningCommonsMenuItem savedItem = ucsbDiningCommonsMenuItemRepository.save(uCSBDiningCommonsMenuItem);

            return savedItem;
        }
    
    @Operation(summary= "Update a UCSB Dining Commons Menu Item")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("")
    public UCSBDiningCommonsMenuItem updateUCSBDiningCommonsMenuItem(
        @Parameter(name="id") @RequestParam Long id,
        @RequestBody @Valid UCSBDiningCommonsMenuItem incoming){
            UCSBDiningCommonsMenuItem uCSBDiningCommonsMenuItem = ucsbDiningCommonsMenuItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(UCSBDiningCommonsMenuItem.class, id));

            uCSBDiningCommonsMenuItem.setDiningCommonsCode(incoming.getDiningCommonsCode());
            uCSBDiningCommonsMenuItem.setName(incoming.getName());
            uCSBDiningCommonsMenuItem.setStation(incoming.getStation());

            ucsbDiningCommonsMenuItemRepository.save(uCSBDiningCommonsMenuItem);
            

            return uCSBDiningCommonsMenuItem;
        }

    @Operation(summary= "Delete a UCSB Dining Commons Menu Item")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("")
    public Object deleteUCSBDiningCommonsMenuItem(
        @Parameter(name="id") @RequestParam Long id){
        
            UCSBDiningCommonsMenuItem uCSBDiningCommonsMenuItem = ucsbDiningCommonsMenuItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(UCSBDiningCommonsMenuItem.class, id));

        ucsbDiningCommonsMenuItemRepository.delete(uCSBDiningCommonsMenuItem);
        return genericMessage("UCSBDiningCommonsMenuItem with id %s deleted".formatted(id));
        }
}

