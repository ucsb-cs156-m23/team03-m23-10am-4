import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm";
import { ucsbDiningCommonsMenuItemFixtures } from "fixtures/ucsbDiningCommonsMenuItemFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("UCSBDiningCommonsMenuItemForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["Dining Commons Name", "Item Name", "Station Name"];
    const testId = "UCSBDiningCommonsMenuItemForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBDiningCommonsMenuItemForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        expect(await screen.findByTestId(`${testId}-diningCommonsCode`)).toBeInTheDocument();
        expect(await screen.findByTestId(`${testId}-name`)).toBeInTheDocument();
        expect(await screen.findByTestId(`${testId}-station`)).toBeInTheDocument();
        expect(await screen.findByTestId(`${testId}-submit`)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

    });

    test("renders correctly when passing in initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBDiningCommonsMenuItemForm initialContents={ucsbDiningCommonsMenuItemFixtures.oneItem} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
        expect(screen.getByText(`Id`)).toBeInTheDocument();
    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBDiningCommonsMenuItemForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
        const cancelButton = screen.getByTestId(`${testId}-cancel`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

    test("that the correct validations are performed", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBDiningCommonsMenuItemForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const submitButton = screen.getByText(/Create/);
        fireEvent.click(submitButton);

        await screen.findByText(/Dining Commons Name is required/);
        expect(screen.getByText(/Item Name is required/)).toBeInTheDocument();
        expect(screen.getByText(/Station Name is required/)).toBeInTheDocument();

        fireEvent.change(screen.getByTestId(`${testId}-diningCommonsCode`), { target: { value: "a".repeat(16) } });
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(screen.getByText(/Max length 15 characters/)).toBeInTheDocument();
        });

        fireEvent.change(screen.getByTestId(`${testId}-name`), { target: { value: "a".repeat(51) } });
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(screen.getByText(/Max length 50 characters/)).toBeInTheDocument();
        });

        fireEvent.change(screen.getByTestId(`${testId}-station`), { target: { value: "a".repeat(101) } });
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(screen.getByText(/Max length 100 characters/)).toBeInTheDocument();
        });
    });

});