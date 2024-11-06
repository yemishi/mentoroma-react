import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <AppBar position="static" sx={{ width: "100vw" }}>
            <Toolbar>
                <Typography
                    variant="h6"
                    component={Link}
                    to="/"
                    sx={{
                        textDecoration: "none",
                        color: "inherit",
                        "&:hover": {
                            textDecoration: "underline",
                        },
                    }}
                >
                    Twitter
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

