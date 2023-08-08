import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import UCSBOrganizationEditPage from "main/pages/UCSBOrganization/UCSBOrganizationEditPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import mockConsole from "jest-mock-console";



const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            orgCode: "17"
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});


describe("UCSBOrganizationEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/UCSBOrganization", { params: { orgCode: "17" } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBOrganizationEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit UCSB Org");
            expect(screen.queryByTestId("UCSBOrganization-orgCode")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);
        const queryClient = new QueryClient();

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/UCSBOrganization", { params: { orgCode: "17" } }).reply(200, {
                orgCode: "17",
                orgTranslationShort: "T",
                orgTranslation: "TTT",
                inactive: false
            });
            axiosMock.onPut('/api/UCSBOrganization').reply(200, {
                orgCode: "17",
                orgTranslationShort: "Q",
                orgTranslation: "QQQ",
                inactive: true
            });
        });

        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBOrganizationEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("UCSBOrganizationForm-orgCode");

            const idField = screen.getByTestId("UCSBOrganizationForm-orgCode");
            const Field1 = screen.getByTestId("UCSBOrganizationForm-orgTranslationShort");
            const Field2 = screen.getByTestId("UCSBOrganizationForm-orgTranslation");
            const Field3 = screen.getByTestId("UCSBOrganizationForm-inactive");
            const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

            expect(idField).toBeInTheDocument();
            expect(idField).toHaveValue("17");
            expect(Field1).toBeInTheDocument();
            expect(Field1).toHaveValue("T");
            expect(Field2).toBeInTheDocument();
            expect(Field2).toHaveValue("TTT");

            fireEvent.change(Field1, { target: { value: 'Q' } });
            fireEvent.change(Field2, { target: { value: 'QQQ' } });
            fireEvent.change(Field3, { target: { value: true } });

            expect(submitButton).toHaveTextContent("Update");
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("UCSB Org Updated - id: 17");

            expect(mockNavigate).toBeCalledWith({ "to": "/ucsborganization" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ orgCode: "17" });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                orgTranslationShort: "Q",
                orgTranslation: "QQQ",
                inactive: false
            })); // posted object


        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBOrganizationEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("UCSBOrganizationForm-orgCode");

            const idField = screen.getByTestId("UCSBOrganizationForm-orgCode");
            const Field1 = screen.getByTestId("UCSBOrganizationForm-orgTranslationShort");
            const Field2 = screen.getByTestId("UCSBOrganizationForm-orgTranslation");
            const Field3 = screen.getByTestId("UCSBOrganizationForm-inactive");
            const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

            expect(idField).toHaveValue("17");
            expect(Field1).toHaveValue("T");
            expect(Field2).toHaveValue("TTT");
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(Field1, { target: { value: 'Q' } });
            fireEvent.change(Field2, { target: { value: 'QQQ' } });
            fireEvent.change(Field3, { target: { value: true } });

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("UCSB Org Updated - id: 17");
            expect(mockNavigate).toBeCalledWith({ "to": "/ucsborganization" });
        });


    });

});

