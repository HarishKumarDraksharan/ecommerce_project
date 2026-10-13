package com.shopsphere.service;

import com.shopsphere.entity.Address;
import com.shopsphere.entity.User;
import com.shopsphere.exception.BadRequestException;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.AddressRepository;
import com.shopsphere.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final PasswordEncoder passwordEncoder;

    // ── Profile ──────────────────────────────────────────────

    public User getProfile(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
    }

    @Transactional
    public User updateProfile(Long userId, String firstName, String lastName, String phone, String profileImage) {
        User user = getProfile(userId);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPhone(phone);
        if (profileImage != null) {
            user.setProfileImage(profileImage);
        }
        return userRepository.save(user);
    }

    @Transactional
    public void changePassword(Long userId, String currentPassword, String newPassword) {
        User user = getProfile(userId);
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new BadRequestException("Current password does not match");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        log.info("Password changed for user {}", user.getEmail());
    }

    // ── Addresses ────────────────────────────────────────────

    public List<Address> getAddressesByUserId(Long userId) {
        return addressRepository.findByUserId(userId);
    }

    @Transactional
    public Address addAddress(Long userId, Address address) {
        User user = getProfile(userId);
        address.setUser(user);

        // If it's the first address, or default is checked
        List<Address> existing = addressRepository.findByUserId(userId);
        if (existing.isEmpty() || address.isDefaultAddress()) {
            existing.forEach(a -> a.setDefaultAddress(false));
            address.setDefaultAddress(true);
        }

        Address saved = addressRepository.save(address);
        log.info("New address created for user {}", userId);
        return saved;
    }

    @Transactional
    public Address updateAddress(Long userId, Long addressId, Address updated) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id: " + addressId));

        if (!address.getUser().getId().equals(userId)) {
            throw new BadRequestException("Address does not belong to user");
        }

        address.setLabel(updated.getLabel());
        address.setFullName(updated.getFullName());
        address.setPhone(updated.getPhone());
        address.setAddressLine1(updated.getAddressLine1());
        address.setAddressLine2(updated.getAddressLine2());
        address.setCity(updated.getCity());
        address.setState(updated.getState());
        address.setPincode(updated.getPincode());
        address.setCountry(updated.getCountry());

        if (updated.isDefaultAddress()) {
            List<Address> existing = addressRepository.findByUserId(userId);
            existing.forEach(a -> a.setDefaultAddress(false));
            address.setDefaultAddress(true);
        }

        return addressRepository.save(address);
    }

    @Transactional
    public void deleteAddress(Long userId, Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id: " + addressId));

        if (!address.getUser().getId().equals(userId)) {
            throw new BadRequestException("Address does not belong to user");
        }

        addressRepository.delete(address);
        log.info("Deleted address {} for user {}", addressId, userId);
    }

    @Transactional
    public void setDefaultAddress(Long userId, Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id: " + addressId));

        if (!address.getUser().getId().equals(userId)) {
            throw new BadRequestException("Address does not belong to user");
        }

        List<Address> existing = addressRepository.findByUserId(userId);
        existing.forEach(a -> a.setDefaultAddress(false));

        address.setDefaultAddress(true);
        addressRepository.save(address);
        log.info("Default address set to {} for user {}", addressId, userId);
    }
}
