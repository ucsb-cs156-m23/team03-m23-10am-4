import { Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

function HelpRequestForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialContents || {}, }
    );
    // Stryker restore all

    const navigate = useNavigate();

    // For explanation, see: https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
    // Note that even this complex regex may still need some tweaks

    // Stryker disable next-line Regex
    const isodate_regex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;

    return (

        <Form onSubmit={handleSubmit(submitAction)}>


            <Row>

                {initialContents && (
                    <Col>
                        <Form.Group className="mb-3" >
                            <Form.Label htmlFor="id">Id</Form.Label>
                            <Form.Control
                                data-testid="HelpRequestForm-id"
                                id="id"
                                type="text"
                                {...register("id")}
                                value={initialContents.id}
                                disabled
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.id?.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                )}

                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="title">Help Request Title</Form.Label>
                        <Form.Control
                            data-testid="HelpRequestForm-title"
                            id="title"
                            type="text"
                            isInvalid={Boolean(errors.title)}
                            {...register("title", { required: "Title is required."})}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.title?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="requestDateTime">Date (iso format)</Form.Label>
                        <Form.Control
                            data-testid="HelpRequestForm-requestDateTime"
                            id="requestDateTime"
                            type="datetime-local"
                            isInvalid={Boolean(errors.requestDateTime)}
                            {...register("requestDateTime", { required: true, pattern: isodate_regex })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.requestDateTime && 'RequestDateTime is required.'}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="requester">Requester Name</Form.Label>
                        <Form.Control
                            data-testid="HelpRequestForm-requester"
                            id="requester"
                            type="text"
                            isInvalid={Boolean(errors.requester)}
                            {...register("requester", {
                                required: "Requester Name is required."
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.requester?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="requestBody">Request Body</Form.Label>
                        <Form.Control
                            data-testid="HelpRequestForm-requestBody"
                            id="requestBody"
                            type="text"
                            isInvalid={Boolean(errors.requestBody)}
                            {...register("requestBody")}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.requestBody?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Button
                        type="submit"
                        data-testid="HelpRequestForm-submit"
                    >
                        {buttonLabel}
                    </Button>
                    <Button
                        variant="Secondary"
                        onClick={() => navigate(-1)}
                        data-testid="HelpRequestForm-cancel"
                    >
                        Cancel
                    </Button>
                </Col>
            </Row>
        </Form>

    )
}

export default HelpRequestForm;
