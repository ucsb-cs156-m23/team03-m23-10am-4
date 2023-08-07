import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { ucsbOrganizationFixtures } from "fixtures/ucsbOrganizationFixtures";
import UCSBOrganizationTable from "main/components/UCSBOrganization/UCSBOrganizationTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
//import axios from "axios";
//import AxiosMockAdapter from "axios-mock-adapter";





const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


const mockToast = jest.fn();

jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

describe("UCSBOrganizationTable tests", () => {

    //const axiosMock = new AxiosMockAdapter(axios);
    const queryClient = new QueryClient();

    const expectedHeaders = ["OrgCode", "OrgTranslationShort", "OrgTranslation", "Inactive"];
    const expectedFields = ["orgCode", "orgTranslationShort", "orgTranslation", "inactive"];
    const testId = "UCSBOrganizationTable";

    test("renders empty table correctly", () => {

        // arrange
        const currentUser = currentUserFixtures.adminUser;

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBOrganizationTable item={[]} currentUser={currentUser} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expectedFields.forEach((field) => {
            const fieldElement = screen.queryByTestId(`${testId}-cell-row-0-col-${field}`);
            expect(fieldElement).not.toBeInTheDocument();
        });
    });

    test("Has the expected column headers, content and buttons for admin user", () => {
        // arrange
        const currentUser = currentUserFixtures.adminUser;

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBOrganizationTable item={ucsbOrganizationFixtures.threeucsbOrganizations} currentUser={currentUser} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expectedFields.forEach((field) => {
            const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
            expect(header).toBeInTheDocument();
        });

        expect(screen.getByTestId(`${testId}-cell-row-0-col-orgCode`)).toHaveTextContent("1");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-orgTranslationShort`)).toHaveTextContent("A");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-orgTranslation`)).toHaveTextContent("AAA");

        expect(screen.getByTestId(`${testId}-cell-row-1-col-orgCode`)).toHaveTextContent("2");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-orgTranslationShort`)).toHaveTextContent("B");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-orgTranslation`)).toHaveTextContent("BBB");

        expect(screen.getByTestId(`${testId}-cell-row-2-col-orgCode`)).toHaveTextContent("3");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-orgTranslationShort`)).toHaveTextContent("C");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-orgTranslation`)).toHaveTextContent("CCC");

        const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
        expect(editButton).toBeInTheDocument();
        expect(editButton).toHaveClass("btn-primary");

        const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();
        expect(deleteButton).toHaveClass("btn-danger");

    });

    test("Has the expected column headers, content for ordinary user", () => {
        // arrange
        const currentUser = currentUserFixtures.userOnly;

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBOrganizationTable item={ucsbOrganizationFixtures.threeucsbOrganizations} currentUser={currentUser} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expectedFields.forEach((field) => {
            const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
            expect(header).toBeInTheDocument();
        });

        expect(screen.getByTestId(`${testId}-cell-row-0-col-orgCode`)).toHaveTextContent("1");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-orgTranslationShort`)).toHaveTextContent("A");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-orgTranslation`)).toHaveTextContent("AAA");

        expect(screen.getByTestId(`${testId}-cell-row-1-col-orgCode`)).toHaveTextContent("2");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-orgTranslationShort`)).toHaveTextContent("B");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-orgTranslation`)).toHaveTextContent("BBB");

        expect(screen.getByTestId(`${testId}-cell-row-2-col-orgCode`)).toHaveTextContent("3");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-orgTranslationShort`)).toHaveTextContent("C");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-orgTranslation`)).toHaveTextContent("CCC");

        expect(screen.queryByText("Delete")).not.toBeInTheDocument();
        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    });


    test("Edit button navigates to the edit page", async () => {
        // arrange
        const currentUser = currentUserFixtures.adminUser;

        // act - render the component
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBOrganizationTable item={ucsbOrganizationFixtures.threeucsbOrganizations} currentUser={currentUser} />
                </MemoryRouter>
            </QueryClientProvider>
        );


        const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
        expect(editButton).toBeInTheDocument();

        // act - click the edit button
        fireEvent.click(editButton);

        // assert - check that the navigate function was called with the expected path
        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/UCSBOrganization/edit/1'));

    });

    test("Delete button calls delete callback", async () => {
        // arrange
        const currentUser = currentUserFixtures.adminUser;

        // act - render the component
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBOrganizationTable item={ucsbOrganizationFixtures.threeucsbOrganizations}  currentUser={currentUser} />
                </MemoryRouter>
            </QueryClientProvider>
        );



        const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();

        // act - click the delete button
        fireEvent.click(deleteButton);

    });








});


/*

   test("Delete button calls delete function for admin user", async () => {

     const currentUser = currentUserFixtures.adminUser;

     //axiosMock.onDelete("/api/UCSBOrganization");
     axiosMock.onDelete("/api/UCSBOrganization").reply(200, "record 1 deleted");

     render(
       <QueryClientProvider client={queryClient}>
         <MemoryRouter>
             <UCSBOrganizationTable item={ucsbOrganizationFixtures.threeucsbOrganizations} currentUser={currentUser} />
         </MemoryRouter>
       </QueryClientProvider>

     );

     await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-orgCode`)).toHaveTextContent("1"); });

     const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
     expect(deleteButton).toBeInTheDocument();

     fireEvent.click(deleteButton);

     await waitFor(() => { expect(mockToast).toBeCalledWith("record 1 deleted"); });

   });

*/
