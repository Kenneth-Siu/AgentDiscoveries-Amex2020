package org.softwire.training.api.routes.v1;

import org.softwire.training.api.core.JsonRequestUtils;
import org.softwire.training.api.core.PasswordHasher;
import org.softwire.training.api.models.ErrorCode;
import org.softwire.training.api.models.FailedRequestException;
import org.softwire.training.api.models.UserApiModel;
import org.softwire.training.db.daos.AgentsDao;
import org.softwire.training.db.daos.UsersDao;
import org.softwire.training.models.Agent;
import org.softwire.training.models.User;
import spark.Request;
import spark.Response;
import spark.utils.StringUtils;

import javax.inject.Inject;
import javax.servlet.MultipartConfigElement;
import javax.servlet.ServletException;
import javax.servlet.http.Part;
import java.io.IOException;
import java.io.InputStream;
import java.util.Optional;

public class UsersRoutes implements EntityCRUDRoutes {

    private final UsersDao usersDao;
    private final AgentsDao agentsDao;
    private final PasswordHasher passwordHasher;

    @Inject
    public UsersRoutes(UsersDao usersDao, AgentsDao agentsDao, PasswordHasher passwordHasher) {
        this.usersDao = usersDao;
        this.agentsDao = agentsDao;
        this.passwordHasher = passwordHasher;
    }

    @Override
    public UserApiModel createEntity(Request req, Response res) throws FailedRequestException {
        UserApiModel userApiModel = JsonRequestUtils.readBodyAsType(req, UserApiModel.class);

        if (userApiModel.getUserId() != 0) {
            throw new FailedRequestException(ErrorCode.INVALID_INPUT, "userId cannot be specified on create");
        }

        User user = new User(userApiModel.getUsername(), passwordHasher.hashPassword(userApiModel.getPassword()));

        int newUserId = usersDao.addUser(user);

        //TODO creating new user should have choice to also create a corresponding agent.
        //And should provide the relevant parameters
        if (true) {
            Agent agent = JsonRequestUtils.readBodyAsType(req, Agent.class);
            agent.setUserId(newUserId);
            agentsDao.addAgent(agent);
        }

        // Set the userId and for security remove the password
        userApiModel.setPassword(null);
        userApiModel.setUserId(newUserId);

        // Create requests should return 201
        res.status(201);

        return userApiModel;
    }

    @Override
    public UserApiModel readEntity(Request req, Response res, int id) throws FailedRequestException {
        int userId = req.attribute("user_id");
        if (userId != id) {
            //TODO check if admin
            throw new FailedRequestException(ErrorCode.INVALID_INPUT, "userId cannot be specified differently to URI");
        }

        return usersDao.getUser(id)
                .map(this::mapModelToApiModel)
                .orElseThrow(() -> new FailedRequestException(ErrorCode.NOT_FOUND, "User not found"));
    }

    @Override
    public UserApiModel updateEntity(Request req, Response res, int id) throws FailedRequestException, IOException, ServletException {
        int userId = req.attribute("user_id");

        if (userId!= id && userId != 0) {
            throw new FailedRequestException(ErrorCode.INVALID_INPUT, "userId cannot be specified differently to URI");
        }

        UserApiModel userApiModel = JsonRequestUtils.readBodyAsType(req, UserApiModel.class);
        Optional<User> optionalUser = usersDao.getUser(userId);
        if(!optionalUser.isPresent()){
            throw new FailedRequestException(ErrorCode.INVALID_INPUT, "userId cannot be found");
        }
        User oldUser = optionalUser.get();
        User user = new User(userApiModel.getUsername(), passwordHasher.hashPassword(userApiModel.getPassword()));
        user.setUserId(id);
        usersDao.updateUser(user);

        return mapModelToApiModel(user);
    }

    public UserApiModel updatePicture(Request req, Response res, int id) throws FailedRequestException, IOException, ServletException {
        int userId = req.attribute("user_id");

        if (userId != id && userId != 0) {
            throw new FailedRequestException(ErrorCode.INVALID_INPUT, "userId cannot be specified differently to URI");
        }

        req.raw().setAttribute("org.eclipse.jetty.multipartConfig", new MultipartConfigElement("/default"));
        Part filePart = req.raw().getPart("file");
        String fileName = filePart.getSubmittedFileName();
        if (StringUtils.isEmpty(fileName) || fileName.lastIndexOf(".") == -1) {
            throw new FailedRequestException(ErrorCode.INVALID_INPUT, "File must have an extension");
        }
        String extension = fileName.substring(fileName.lastIndexOf(".") + 1);
        //TODO save extension and serve with picture
        try (final InputStream in = filePart.getInputStream()) {
            usersDao.updateUserPicture(userId, in);
        }catch(Exception e){
            throw new FailedRequestException(ErrorCode.UNKNOWN_ERROR, "failed to update image");
        }

        Optional<User> user = usersDao.getUser(userId);
        if(!user.isPresent()){
            throw new FailedRequestException(ErrorCode.NOT_FOUND, "no such user found");
        }
        filePart.delete();
        return mapModelToApiModel(user.get());
    }

    private UserApiModel mapModelToApiModel(User user) {
        UserApiModel userApiModel = new UserApiModel();
        userApiModel.setUserId(user.getUserId());
        userApiModel.setUsername(user.getUsername());
        // Deliberately do not set the password for security reasons

        return userApiModel;
    }

    @Override
    public Object deleteEntity(Request req, Response res, int id) throws Exception {
        if (StringUtils.isNotEmpty(req.body())) {
            throw new FailedRequestException(ErrorCode.INVALID_INPUT, "User delete request should have no body");
        }

        // Do not do anything with output, if nothing to delete request is successfully done (no-op)
        usersDao.deleteUser(id);
        res.status(204);

        return new Object();
    }

}
