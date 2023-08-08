import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBOrganizationTable from 'main/components/UCSBOrganization/UCSBOrganizationTable';
import { useCurrentUser , hasRole} from 'main/utils/currentUser'
import { Button } from 'react-bootstrap';


export default function UCSBOrganizationIndexPage() {

    const currentUser = useCurrentUser();

    const { data: items, error: _error, status: _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            ["/api/UCSBOrganization/all"],
            { method: "GET", url: "/api/UCSBOrganization/all" },
            // Stryker disable next-line all : don't test default value of empty list
            []
        );

    const createButton = () => {
        if (hasRole(currentUser, "ROLE_ADMIN")) {
            return (
                <Button
                    variant="primary"
                    href="/ucsborganization/create"
                    style={{ float: "right" }}
                >
                    Create New Org
                </Button>
            )
        }
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                {createButton()}
                <h1>UCSB Organizations</h1>
                <UCSBOrganizationTable item={items} currentUser={currentUser} />
            </div>
        </BasicLayout>
    );
}
