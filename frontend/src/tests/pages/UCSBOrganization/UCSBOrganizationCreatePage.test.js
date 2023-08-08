import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UCSBOrganizationCreatePage from "main/pages/UCSBOrganization/UCSBOrganizationCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

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
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});


describe("UCSBOrganizationCreatePage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        //jest.clearAllMocks();
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });


    test("renders without crashing", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBOrganizationCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });



    test("on submit, makes request to backend, and redirects to /ucsborganization", async () => {

        const queryClient = new QueryClient();
        const item = {
            orgCode: "5",
            orgTranslationShort: "D",
            orgTranslation: "DDD",
            inactive: false
        };

        const item2 = {
            orgCode: "6",
            orgTranslationShort: "E",
            orgTranslation: "EEE",
            inactive: false
        };

        axiosMock.onPost("/api/UCSBOrganization/post").reply(202, item);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBOrganizationCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => {
            expect(screen.getByTestId("UCSBOrganizationForm-orgCode")).toBeInTheDocument();
        });

        const Input0 = screen.getByTestId("UCSBOrganizationForm-orgCode");
        const Input1 = screen.getByTestId("UCSBOrganizationForm-orgTranslationShort");
        const Input2 = screen.getByTestId("UCSBOrganizationForm-orgTranslation");
        const Input3 = screen.getByTestId("UCSBOrganizationForm-inactive");
        const createButton = screen.getByTestId("UCSBOrganizationForm-submit");
        expect(createButton).toBeInTheDocument();

        fireEvent.change(Input0, { target: { value: '5' } });
        fireEvent.change(Input1, { target: { value: 'D' } });
        fireEvent.change(Input2, { target: { value: 'DDD' } });
        fireEvent.change(Input3, { target: { value: false } });
        fireEvent.click(createButton);

        /*
             axios.post("/api/UCSBOrganization/post", {
            url: "/api/UCSBOrganization/post",
            method: "POST",
            params: {
                orgCode: item2.orgCode,
                orgTranslationShort: item2.orgTranslationShort,
                orgTranslation: item2.orgTranslation,
                inactive: item2.inactive,
            }
        })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });
        */




        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        //console.log(axiosMock.history.post[0]);
        //console.log(JSON.parse(axiosMock.history.post[0].data).params);

        //expect(axiosMock.history.post[0].data.params).toEqual(item2);

        // assert - check that the toast was called with the expected message
        expect(mockToast).toBeCalledWith("New UCSB org Created - id: 5");
        expect(mockNavigate).toBeCalledWith({ "to": "/ucsborganization" });

    });

});

