DEALER_SOURCES = (
    ("CADA", "CADA"),

    ("TADA","TADA")
)

DEALER_ROLES = (
    ("0", "Default"),
    ("1", "See Invoicing Info"),
    ("2", "View All Jobs of Dealership"),
    ("3", "View All Jobs/Invoicing Info of a Dealership"),
    ("4", "Admin"),
    ("5", "View Resume & Job posting")
)

MEMBEE_DEALER_ROLES = (
    "CarsandJobs SuperAdmin",
    "CarsandJobs admin",
    "CarsandJobs User ",
    "CarsandJobs admin and CarsandJobs user",
)

MEMBEE_MAPPED_ROLES = {
    MEMBEE_DEALER_ROLES[0] : DEALER_ROLES[4][0],
    MEMBEE_DEALER_ROLES[1] : DEALER_ROLES[3][0],
    MEMBEE_DEALER_ROLES[2] : DEALER_ROLES[2][0],
    MEMBEE_DEALER_ROLES[3] : DEALER_ROLES[3][0]
}
