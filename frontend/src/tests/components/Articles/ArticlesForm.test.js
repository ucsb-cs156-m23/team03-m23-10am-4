import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import ArticlesForm from "main/components/Articles/ArticlesForm";
import { articlesFixtures } from "fixtures/articlesFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("ArticlesForm tests", () => {

    test("renders correctly", async () => {

        render(
            <Router  >
                <ArticlesForm />
            </Router>
        );
        await screen.findByText(/Title/);
        await screen.findByText(/Create/);
    });

    test("renders correctly when passing in a Articles", async () => {
            
            render(
                <Router  >
                    <ArticlesForm initialContents={articlesFixtures.oneArticle} />
                </Router>
            );
            await screen.findByTestId(/ArticlesForm-id/);
            expect(screen.getByText(/Id/)).toBeInTheDocument();
            expect(screen.getByTestId(/ArticlesForm-id/)).toHaveValue("1");
    });

    test("Correct Error messsages on bad input", async () => {
        
        render(
            <Router  >
                <ArticlesForm />
            </Router>
        );

        await screen.findByTestId("ArticlesForm-dateAdded");
        const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
        const emailField = screen.getByTestId("ArticlesForm-email");
        const submitButton = screen.getByTestId("ArticlesForm-submit");

        fireEvent.change(dateAddedField, { target: { value: 'bad-input' } });
        fireEvent.change(emailField, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);

        await screen.findByText(/Email is invalid/);
    });

    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <ArticlesForm />
            </Router>
        );

        await screen.findByTestId("ArticlesForm-submit");
        const submitButton = screen.getByTestId("ArticlesForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/Title is required/);
        await screen.findByText(/URL is required/);
        await screen.findByText(/Email is required/);
        await screen.findByText(/Date Added is required/);
        await screen.findByText(/Explanation is required/);
    });

    test("No Error messsages on good input", async () => {
        
        const mockSubmitAction = jest.fn();

        render(
            <Router  >
                <ArticlesForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("ArticlesForm-title");

        const titleField = screen.getByTestId("ArticlesForm-title");
        const urlField = screen.getByTestId("ArticlesForm-url");
        const emailField = screen.getByTestId("ArticlesForm-email");
        const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
        const explanationField = screen.getByTestId("ArticlesForm-explanation");
        const submitButton = screen.getByTestId("ArticlesForm-submit");

        fireEvent.change(titleField, { target: { value: 'good-input' } });
        fireEvent.change(urlField, { target: { value: 'good-input' } });
        fireEvent.change(emailField, { target: { value: 'test@goodinput.com' } });
        fireEvent.change(dateAddedField, { target: { value: '2021-05-05T12:00' } });
        fireEvent.change(explanationField, { target: { value: 'good-input' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/Date Added is invalid/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Email is invalid/)).not.toBeInTheDocument();
    });

    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <ArticlesForm />
            </Router>
        );
        await screen.findByTestId("ArticlesForm-cancel");
        const cancelButton = screen.getByTestId("ArticlesForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });
});