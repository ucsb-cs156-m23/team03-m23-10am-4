import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import HelpRequestForm from "main/components/HelpRequest/HelpRequestForm";
import { ucsbDatesFixtures } from "fixtures/ucsbDatesFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("HelpRequestForm tests", () => {

    test("renders correctly", async () => {

        render(
            <Router  >
                <HelpRequestForm />
            </Router>
        );
        await screen.findByText(/Help Request Title/);
        await screen.findByText(/Create/);
    });


    test("renders correctly when passing in a HelpRequest", async () => {

        render(
            <Router  >
                <HelpRequestForm initialContents={ucsbDatesFixtures.oneDate} />
            </Router>
        );
        await screen.findByTestId(/HelpRequestForm-id/);
        expect(screen.getByText(/Id/)).toBeInTheDocument();
        expect(screen.getByTestId(/HelpRequestForm-id/)).toHaveValue("1");
    });


    test("Correct Error messsages on bad input", async () => {

        render(
            <Router  >
                <HelpRequestForm />
            </Router>
        );
        await screen.findByTestId("HelpRequestForm-requestDateTime");
        const requestDateTimeField = screen.getByTestId("HelpRequestForm-requestDateTime");
        const titleField = screen.getByTestId("HelpRequestForm-title");
        const requesterField = screen.getByTestId("HelpRequestForm-requester");
        const submitButton = screen.getByTestId("HelpRequestForm-submit");

        fireEvent.change(titleField, { target: { value: 'Help' } });
        fireEvent.change(requesterField, { target: { value: 'Iain W' } });
        fireEvent.change(requestDateTimeField, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);
        
        await screen.findByText(/RequestDateTime is required./);
    });

    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <HelpRequestForm />
            </Router>
        );
        await screen.findByTestId("HelpRequestForm-submit");
        const submitButton = screen.getByTestId("HelpRequestForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/Title is required./);
        expect(screen.getByText(/Requester Name is required./)).toBeInTheDocument();
        expect(screen.getByText(/RequestDateTime is required./)).toBeInTheDocument();

    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <HelpRequestForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("HelpRequestForm-title");

        const titleField = screen.getByTestId("HelpRequestForm-title");
        const requestDateTimeField = screen.getByTestId("HelpRequestForm-requestDateTime");
        const requesterField = screen.getByTestId("HelpRequestForm-requester");
        const submitButton = screen.getByTestId("HelpRequestForm-submit");

        fireEvent.change(titleField, { target: { value: 'Help' } });
        fireEvent.change(requesterField, { target: { value: 'Iain W' } });
        fireEvent.change(requestDateTimeField, { target: { value: '2022-01-02T12:00' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());
            
        expect(screen.queryByText(/Date must be in ISO format/)).not.toBeInTheDocument();

    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <HelpRequestForm />
            </Router>
        );
        await screen.findByTestId("HelpRequestForm-cancel");
        const cancelButton = screen.getByTestId("HelpRequestForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});


